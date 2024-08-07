import { connect } from 'mongoose';
const { MONGODB_URI ,MONGODB_URI1} = require('../../startup/envconfig');
export default async function mongooseConnect(): Promise<void> {
  const mongoDBURI = MONGODB_URI ?? 'mongodb://localhost:27017';
  await connect(mongoDBURI);
}