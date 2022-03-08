import { MigrationFunction } from "contentful-migration";

export = function (migration) {
  const version = migration
    .createContentType("versionTracking")
    .name("Version Tracking");

  version
    .createField("id")
    .name("ID")
    .type("Symbol")
    .required(true)
    .disabled(true)
    .validations([{ unique: true }]);

  version.displayField("id");

  version
    .createField("version")
    .name("Version")
    .type("Symbol")
    .required(true)
    .disabled(true);
} as MigrationFunction;
