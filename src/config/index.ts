const config: { name: string; baseAPIRoute: string; port: number | string } = {
  name: "Document Service",
  baseAPIRoute: "api/v1",
  port: process.env.PORT || 8080,
};

export default config;
