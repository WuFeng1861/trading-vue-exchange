export const MQ_PRODUCER_CONFIG_EMAIL_DIRECT = {
  exchange: 'email.direct',
  routingKey: 'binding.key.bingAddress',
  mysql_timeInterval: 1000,
};

export const MQ_PRODUCER_CONFIG_NOWEMAIL_DIRECT = {
  exchange: 'nowemail.direct',
  routingKey: 'binding.key.nowemail',
  mysql_timeInterval: 1000,
};
