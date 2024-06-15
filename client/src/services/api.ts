import axios from "axios";

export const api = ({
  endpoint,
  config,
}: {
  endpoint: string;
  config?: Parameters<typeof axios>[1];
}) => {
  return axios(`http://localhost:5212/api/${endpoint}`, config);
};
