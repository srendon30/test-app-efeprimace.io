export const extractAllowedPermissionsSlugs = (permissions) => {
  const slugs = new Set();

  for (const moduleGroup of Object.values(permissions.modules)) {
    for (const module of Object.values(moduleGroup)) {
      slugs.add(module.slug);

      if (module.child_options && module.child_options.length > 0) {
        module.child_options.forEach((child) => {
          slugs.add(child.slug);
        });
      }
    }
  }

  return slugs;
};
