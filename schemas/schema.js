const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLList } = require('graphql');
const User = require('../models/User');

// Typ użytkownika
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    role: { type: GraphQLString }
  })
});

// Query - pobieranie danych
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return User.find();
      }
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return User.findById(args.id);
      }
    }
  }
});

// Mutacje - dodawanie, edycja, usuwanie danych
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        role: { type: GraphQLString }
      },
      resolve(parent, args) {
        const user = new User({
          name: args.name,
          email: args.email,
          role: args.role
        });
        return user.save();
      }
    },
    deleteUser: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return User.findByIdAndDelete(args.id);
      }
    }
  }
});

// Eksport schematu
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
