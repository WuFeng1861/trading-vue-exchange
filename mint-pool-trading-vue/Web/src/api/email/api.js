import instance from './instance.js';

export const sendBindAddressEmail = (id) => {
  return instance.post('/sendBindCode', {id});
}
