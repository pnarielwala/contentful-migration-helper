export const getVersionOfFile = (file: string) =>
  file.replace(/(\d+)(.*)\.(ts|js)/, "$1");

export const getFileOfVersion = (version: string, files: Array<string>) =>
  files.find((file) => file.includes(`${version}.`));

export const getStringDate = () => {
  const pad = (n: number) => {
    return n < 10 ? "0" + n : n;
  };

  const d = new Date();

  return (
    d.toISOString().substring(0, 10) +
    "-" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes())
  );
};
