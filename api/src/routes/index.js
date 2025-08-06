import { Router } from "express";
import { roomRoutes } from "./room-routes.js";

const routes = Router()
routes.use(roomRoutes)

export { routes }