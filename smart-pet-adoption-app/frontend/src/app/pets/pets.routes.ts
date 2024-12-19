import { Routes } from "@angular/router";
import { ListComponent } from "./list.component";
import { AddComponent } from "./add.component";

export const pets_routes: Routes = [
  { path: "", component: ListComponent },
  { path: "add", component: AddComponent },
];
