const config = {
    db: {
      /* don't expose password or any sensitive info, done only for demo */
      host: "mapwatcher-rds.crhcghnub9gg.us-east-1.rds.amazonaws.com",
      user: "jomael_gemota",
      password: "Zus63WsFYygy4UwzsfTNXpngFGbLLR",
      database: "warehouse_tools",
    },
    listPerPage: 10,
  };
  module.exports = config;