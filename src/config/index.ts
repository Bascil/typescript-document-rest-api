interface Config {
  service: string;
  apiVersion: string;
  port: number | string;
}

export const config: Config = {
  service: "Document Service",
  apiVersion: `/api/v1`,
  port: process.env.PORT || 3000,
};
