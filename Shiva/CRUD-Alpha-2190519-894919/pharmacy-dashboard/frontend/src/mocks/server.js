// src/mocks/server.js
// This file is used for setting up MSW for unit tests
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)
