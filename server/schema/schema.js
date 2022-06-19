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
  GraphQLNonNull,
  GraphQLEnumType,
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

//Mutations

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // Add client
    addClient: {
      type: ClientType,
      /*Arguments or args are the fiels that we need to add to create a user */
      args: {
        name: {
          type: GraphQLNonNull(GraphQLString),
        },
        email: {
          type: GraphQLNonNull(GraphQLString),
        },
        phone: {
          type: GraphQLNonNull(GraphQLString),
        },
        /*GraphQLNonNull :- to avoid submitting with null value or without entering a name*/
      },
      resolve(parent, args) {
        /*We are creating a new client and passing the value from the arguments */
        const client = new Client({
          name: args.name,
          email: args.email,
          phone: args.phone,
        });
        return client.save();
      },
    },
    // Delete client
    deleteClient: {
      type: ClientType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return Client.findByIdAndDelete(args.id);
      },
    },
    // Add Project
    addProject: {
      type: projectType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        status: {
          type: new GraphQLEnumType({
            name: 'ProjectStatus',
            values: {
              new: { value: 'Not started' },
              progress: { value: 'In progress' },
              completed: { value: 'Completed' },
            },
          }),
          defaultValue: 'Not started',
        },
        clientId: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        const project = new Project({
          name: args.name,
          description: args.description,
          status: args.status,
          clientId: args.clientId,
        });
        return project.save();
      },
    },
    // Delete project
    deleteProject: {
      type: projectType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return Project.findByIdAndRemove(args.id);
      },
    },
    // Update a project
    updateProject: {
      type: projectType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        /* We are not using GraphQLNonNull because it is not mandatory to update the name or description 
        even though if name or description is added we can update this one */
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: {
          type: new GraphQLEnumType({
            name: 'ProjectStatusUpdate',
            values: {
              new: { value: 'Not started' },
              progress: { value: 'In progress' },
              completed: { value: 'Completed' },
            },
          }),
        },
      },
      resolve(parent, args) {
        return Project.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name: args.name,
              description: args.description,
              status: args.status,
            },
          },
          { new: true } // new means if the project is not there it is gonna create that
        );
      },
    },
  },
});
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});
