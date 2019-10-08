import { NgModule } from '@angular/core';
import { CoreModule } from './core/core.module';
import {ReactiveFormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CoreModule,
    AppRoutingModule,
            
    ReactiveFormsModule,
        
  ],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
