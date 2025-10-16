export const checkAuth = (req, res, next) => {
  try {
    if (req.session.user || req.session.admin) {
      return next();
    }
    res.status(401).json({ message: "user is not authenticated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const checkUser = (req, res, next) => {
  try {
    if (req.session.user) {
      return next();
    }
    res.status(401).json({ message: "user is not authenticated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const checkAdmin = (req, res, next) => {
  try {
    if (req.session.admin) {
      return next();
    }
    res.status(401).json({ message: "Not authorized" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const checkSuperAdmin = (req, res, next) => {
  try {
    if (req.session.admin.role === "superadmin") {
      return next();
    }
    res.status(401).json({ message: "Not authorized, should be super admin" });
  } catch (error) {
    res.status(401).json({ message: "Not authorized" });
  }
};
