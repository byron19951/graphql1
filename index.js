import express from "express";
import {typeDefs} from './data/schema';
import {ApolloServer} from 'apollo-server-express';
import {resolvers} from './data/resolvers'
import dotenv from 'dotenv';
dotenv.config({path:'variables.env'});

import jwt from 'jsonwebtoken';
const app =express();
const server= new ApolloServer ({
    engine: {
        reportSchema: true
      },

    typeDefs,
    resolvers,
    context:async({req})=>{
        const token=req.headers['authorization'];
        if(token !== "null"){
            try {
                //verificamos el token del front end 
                const usuarioActual=await jwt.verify(token, process.env.SECRETO );
                
                //agregamos el usuario actual al request
                req.usuarioActual=usuarioActual;

                return{
                    usuarioActual
                }
            } catch (err) {
                console.log(err);
            }
        }

    }

});
server.applyMiddleware({app});

app.listen({port:process.env.PORT || 4000},()=>console.log(`el servidor esta corriendo ${server.graphqlPath
}`));
