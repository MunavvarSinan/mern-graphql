// const { projects, clients } = require('../sampleData');
//Mongoose models
const Project = require('../models/Project');
const Client = require('../models/Client');

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
} = require('graphql');

//Client

const ClientType = new GraphQLObjectType({
  name: 'Client',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  }),
});

const projectType = new GraphQLObjectType({
  name: 'ProjectType',
  fields: () => ({
    id: { type: GraphQLID }, // specifiying the type
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    client: {
      // this is how you build a relashionship with schemas
      type: ClientType,
      resolve(parent, args) {
        // if we want to access any of the project data we can use the parent argument to get that
        // return clients.find((client) => client.id === parent.clientId);
        return Client.findById(parent.clientId); // clientId we have added in the models
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    project: {
      type: projectType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // return projects.find((project) => project.id === args.id);
        return Project.findById(args.id);
      },
    },
    allProjects: {
      type: GraphQLList(projectType),
      /* we have used graphql list used because we don't need to access any specific element
      we just need to list all the data so we are using a grapghql list to get that */

      /* We don't need args because we are not passing any argument */
      resolve(parent, args) {
        // return projects;
        return Project.find();
      },
    },
    allClients: {
      type: GraphQLList(ClientType),
      resolve(parent, args) {
        // return clients;
        return Client.find();
      },
    },
    client: {
      type: ClientType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // return clients.find((client) => client.id === args.id);
        return Client.findById(args.id);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
