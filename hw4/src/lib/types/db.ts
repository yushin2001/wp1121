export type User = {
  id: string;
  username: string;
  provider: "credentials";
};

export type Document = {
  id: string;
  title: string;
  content: string;
};
