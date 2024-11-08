declare module "*/package.json" {
  interface PackageJson {
    name: string;
    version: string;
    description?: string;
    author?: string;
    license?: string;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  }

  const value: PackageJson;
  export default value;
} 