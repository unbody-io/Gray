### Changes made by Perriex

- Bugfix: eslint-errors

All errors and warnings were suggested by eslint.

- [x] Remove unused imports from all .ts files
- [x] Remove redundant code in conditions
- [x] Cast parameters to strings when passed to a component
- [x] Replace logical AND with optional chaining

-  Feature : api-loading-pending-timeout

- [x] Disable loading when an error is received on the explore/search page
- [x] Add next progress when loading new pages 

Future improvements:

- [ ] Add documentation for vital components
- [ ] Implement error handling (consider adding customized error pages for 404 and 500 errors)
- [ ] Client Service: Set reasonable timeouts and handle unexpected errors so they do not propagate to the host.
- [ ] Designs are not responsive for small screens