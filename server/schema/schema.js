const Projects = require('../models/project')
const Clients = require('../models/client')

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
} = require('graphql')

// Project Type
const ProjectType = new GraphQLObjectType({
  name: 'Project',
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    clientId: {
      type: GraphQLString,
    },
    name: {
      type: GraphQLString,
    },
    description: {
      type: GraphQLString,
    },
    status: {
      type: GraphQLString,
    },
    client: {
      type: ClientType,
      resolve(parent, args) {
        return Clients.findById(parent.clientId)
      },
    },
  }),
})

// Client Type
const ClientType = new GraphQLObjectType({
  name: 'Client',
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    name: {
      type: GraphQLString,
    },
    email: {
      type: GraphQLString,
    },
    phone: {
      type: GraphQLString,
    },
  }),
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    // get all projects
    projects: {
      type: new GraphQLList(ProjectType),
      resolve(parent, args) {
        return Projects.find({})
      },
    },

    // get client project
    project: {
      type: ProjectType,
      args: {
        id: {
          type: GraphQLID,
        },
      },
      resolve(parent, args) {
        return Projects.findById(args.id)
      },
    },

    // get all clients
    clients: {
      type: new GraphQLList(ClientType),
      resolve(parent, args) {
        return Clients.find({})
      },
    },

    // get single client using id
    client: {
      type: ClientType,
      args: {
        id: {
          type: GraphQLID,
        },
      },
      resolve(parent, args) {
        return Clients.findById(args.id) // Clients.findById({ _id: args.id })
      },
    },
  },
})

// Mutations
const RootMutation = new GraphQLObjectType({
  name: 'RootMutationType',
  fields: {
    // ADD NEW CLIENT
    addClient: {
      type: ClientType,
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
      },
      resolve(parent, args) {
        const newClient = new Clients({
          name: args.name,
          email: args.email,
          phone: args.phone,
        })

        return newClient.save()
      },
    },

    // DELETE EXISTING CLIENT
    deleteClient: {
      type: ClientType,
      args: {
        id: {
          type: GraphQLNonNull(GraphQLID),
        },
      },
      resolve(parent, args) {
        Projects.find({ clientId: args.id }).then((project) => {
          project.forEach((project_temp) => {
            project_temp.remove()
          })
        })

        return Clients.findByIdAndRemove(args.id)
      },
    },

    // ADD PROJECT
    addProject: {
      type: ProjectType,
      args: {
        name: {
          type: GraphQLNonNull(GraphQLString),
        },
        description: {
          type: GraphQLNonNull(GraphQLString),
        },
        status: {
          type: new GraphQLEnumType({
            name: 'ProjectStatus',
            values: {
              new: { value: 'Not Started' },
              progress: { value: 'In Progress' },
              completed: { value: 'Completed' },
            },
          }),
          defaultValue: 'Not Started',
        },
        clientId: {
          type: GraphQLNonNull(GraphQLID),
        },
      },
      resolve(parent, args) {
        const newProject = new Projects({
          name: args.name,
          description: args.description,
          status: args.status,
          clientId: args.clientId,
        })

        return newProject.save()
      },
    },

    // DELETE EXISTING PROJECT
    deleteProject: {
      type: ProjectType,
      args: {
        id: {
          type: GraphQLNonNull(GraphQLID),
        },
      },
      resolve(parent, args) {
        return Projects.findByIdAndRemove(args.id)
      },
    },

    // UPDATE EXISTING PROJECT
    updateProject: {
      type: ProjectType,
      args: {
        id: {
          type: GraphQLNonNull(GraphQLID),
        },
        name: {
          type: GraphQLString,
        },
        description: {
          type: GraphQLString,
        },
        status: {
          type: new GraphQLEnumType({
            name: 'ProjectStatusUpdate',
            values: {
              new: { value: 'Not Started' },
              progress: { value: 'In Progress' },
              completed: { value: 'Completed' },
            },
          }),
        },
      },
      resolve(parent, args) {
        return Projects.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name: args.name,
              description: args.description,
              status: args.status,
            },
          },
          {
            new: true,
          }
        )
      },
    },
  },
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
})
