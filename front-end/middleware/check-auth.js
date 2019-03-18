
const logedOutRoutes = ['/']
const adminRoutes = ['/admin']
const partenaireRoutes = ['/partenaire']


export default async function({ env, route, store, req, res, redirect, app, isServer }) {
    // Transition states
    if (
        route.path.indexOf('/connexion/login') === 0 ||
        route.path.indexOf('/connexion/logout') === 0 ){
        return
    }
    

    console.log(JSON.stringify(store.state))
    if(!store.state.utilisateurCourant || !store.state.utilisateurCourant.id){
        if(logedOutRoutes.indexOf(route.path) < 0){
            return redirect('/')
        }
    } else {
        if(!store.state.utilisateurCourant.validated && route.path != '/connexion/inscription' ){
            return redirect('/connexion/inscription')
        }

        if(logedOutRoutes.indexOf(route.path) > -1){
            
            return redirect('/interventions')
        }

        if(adminRoutes.indexOf(route.path) > -1){
            if(store.state.utilisateurCourant.profilId != 1){
                return redirect('/interventions')
            }
        }

        if(partenaireRoutes.indexOf(route.path) > -1){
            if(store.state.utilisateurCourant.profilId != 2){
                return redirect('/interventions')
            }
        }

    }
}
