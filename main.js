const express = require('express');
const { ApolloServer, gql,GraphQLUpload } = require('apollo-server-express');
const fs = require('fs')
const path = require('path')
  // Construct a schema, using GraphQL schema language
  const typeDefs = gql`
  scalar FileUpload
    type Query {
      hello: String
    }
    type FieldUpload{
      url:String!
    }
    type Mutation{
      addphoto(file:FileUpload!):FieldUpload!
    }
  `;

  // Provide resolver functions for your schema fields
  const resolvers = {
    FileUpload:GraphQLUpload,
    Query: {
      hello: () => 'Hello world!',
    },
    Mutation:{
      addphoto:async(parent,{file})=>{
        const {createReadStream,filename,mimetype} = await file
        const location = path.join(__dirname,`/public/images/${filename}`)
        const myfile = createReadStream()

        await myfile.pipe(fs.createWriteStream(location))
        return {
          url:`http://localhost:4000/images/${filename}`
        }
      }
    }
  };

  const server = new ApolloServer({ typeDefs, resolvers });


  const app = express();
  app.use(express.static('public'))
  server.applyMiddleware({ app });

 app.listen({port:4000},()=>{
   console.log("Server run port 4000")
 })