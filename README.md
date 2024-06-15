# typescript-library-template

This is a template repository for developing libraries for Browser/Node.js with TypeScript.

## How to publish to npm

### Step 1

Rewrite the following items in package.json in each folder as appropriate.

* name
* description
* keywords
* repository
* author
* bugs
* homepage

### Step 2

Next, rewrite the signature and number of years in the LICENSE file.

```
Copyright (c) 20xx your_name
```

### Step3

Rewrite the [repo option](./.changeset/config.json) in Changeset.  

```
"changelog": [
  "@changesets/changelog-github",
  { "repo": "your_name/repository_name" }
],
```

Also, do not forget to rewrite the title of CHANGELOG.md.

### Step4

Implement a great library under the [packages](./packages) folder.  
Be sure to provide proper test code so that users of the library can feel comfortable.

Execute the following commands to confirm that the build and test pass successfully.  
Be careful not to publish libraries that do not work properly.

```bash
$ yarn build
$ yarn test
```

### Step5

Write a description of the library in README.md.

It is also a good idea to create a simple project under the [examples](./examples) directory so that you can check the operation by simply cloning the repository.  
It is important to keep the project as simple as possible, as complex projects take time to understand.

### Step6

To publish the library to NPM, add the NPM access key with the key `NPM_TOKEN` to the [repository secret](../../settings/secrets/actions).  
This will automatically publish the library to NPM when the release workflow is executed.

### Step7

The following command can be used to create a patch to update the library version.

```bash
$ yarn changeset
```

When the patch is committed to the main branch, CI will run and create a PR for the release.  
Then, simply merge the PR for release and the library will be automatically published to NPM.
