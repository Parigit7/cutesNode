const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Normalize role string comparison
    const userRole = req.user.role ? req.user.role.toUpperCase() : '';
    const hasRole = allowedRoles.some(role => role.toUpperCase() === userRole);

    if (!hasRole) {
      return res.status(403).json({ error: 'Access denied' });
    }

    next();
  };
};

module.exports = authorize;
