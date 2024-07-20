import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: "login",
        loadComponent: ()=> import("./components/login/login.component")
    },
    {
        path: "",
        loadComponent: ()=> import("./components/layouts/layouts.component"),
        children: [
            {
                path: "",
                loadComponent: ()=> import("./components/home/home.component")
            },
            {
                path: "game",
                loadComponent: ()=> import("./components/game/game.component")
            }
        ]
    },
    {
        path: "**",
        loadComponent: ()=> import("./components/not-found/not-found.component")
    }
];
