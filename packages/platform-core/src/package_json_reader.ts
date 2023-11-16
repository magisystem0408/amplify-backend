import fs from 'fs';
import z from 'zod';

/**
 * return the package json
 */
export class PackageJsonReader {
  read = (absolutePackageJsonPath: string): PackageJson => {
    if (!fs.existsSync(absolutePackageJsonPath)) {
      throw new Error(
        `Could not find a package.json file at ${absolutePackageJsonPath}`
      );
    }
    let jsonParsedValue: Record<string, unknown>;
    try {
      jsonParsedValue = JSON.parse(
        // we have to use sync fs methods here because this is also used during cdk synth
        fs.readFileSync(absolutePackageJsonPath, 'utf-8')
      );
    } catch (err) {
      throw new Error(
        `Could not JSON.parse the contents of ${absolutePackageJsonPath}`
      );
    }
    return packageJsonSchema.parse(jsonParsedValue);
  };
}

/**
 * Type for package.json content.
 *
 * Add additional validation if there are other fields we need to read
 */
export const packageJsonSchema = z.object({
  name: z.string().optional(),
  version: z.string().optional(),
  type: z.union([z.literal('module'), z.literal('commonjs')]).optional(),
});

export type PackageJson = z.infer<typeof packageJsonSchema>;