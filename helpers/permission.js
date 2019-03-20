module.exports = {
    adminPermissionOnly: function(req, res, next){
        if(req.isAuthenticated() && req.user.userType == 'admin'){
            return next();
        };

        req.flash('errorMsg', 'Você precisa de permissões de administrator para entrar nessa pagina!');
        res.redirect('/');
    },
    loggedPermissionOnly: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        };
        res.redirect('/');
    },
    visitorPermissionOnly: function(req, res, next){
        if(req.isAuthenticated() == false ){
            return next();
        };
        res.redirect('/');
    }
};