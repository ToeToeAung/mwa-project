import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card'; 

@Component({
  selector: 'app-about',
  imports: [MatCardModule],
  template: `
    <div class="about-container">
      <mat-card class="about-card">
      <mat-card-header>
        <mat-card-title>About Smart Pet Adoption App</mat-card-title>
      </mat-card-header>
    <mat-card-content>
      <p>
      "Not every pet is right for every person, and not every home is right for every pet. If your pet had Tinder, would it choose you? Let Smart Pet Adoption do the job."
        The Smart Pet Adoption App aims to improve the pet adoption process by using advanced technology to match pets with the ideal homes. This application will assist shelter staff/admin in finding the best suitable homes for their pets by considering a variety of factors as below 
        •	Each pet has a unique personality, such as activity level, social behavior etc.
        •	Preferences of pet seekers should be considered. The app gathers information about pet seekers' ideal preferences such as what they are looking for in a pet, including size, breed, age etc.
        •	If the user already owns pets, the app ensures that the new pet is compatible with their current pets, reducing the chances of conflict or stress.
      </p>
      <h4> AI RAG Integration in the Backend </h4>
      <p>To make the pets and the seekers matching process more efficient and accurate, AI-based Retrieval-Augmented Generation (RAG) will be developed in the backend of the app.
      RAG will use large-scale data retrieval from a database of pet characteristics, user/pet seeker preferences, and past adoption data. This allows the app to dynamically search through relevant pet profiles and generate personalized recommendations.
      AI RAG will also generate responses based on both retrieved data and contextual understanding of the pet seeker’s needs and the pet's character, ensuring that every recommendation aligns with the seeker’s preferences and the pet’s personality. By analyzing pet seekers’ previous pet ownership experiences and behavioral patterns, the app can refine its suggestions, offering a better understanding of which pets are likely to be the best fit.
      This combination of data-driven insights and machine learning allows the Smart Pet Adoption App to make smarter, more accurate matches between pets and adopters, ensuring a higher rate of successful adoptions and happier homes for the pets.
      </p>
    </mat-card-content>
    <!-- <mat-card-actions>
      <button mat-button>Learn More</button>
    </mat-card-actions> -->
</mat-card>
</div>
  `,
  styles: [`
          .about-container {
          width: 100%;
          max-width: 70%;
          margin: 20px auto;
          padding: 20px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 -4px 8px rgba(0, 0, 0, 0.1);
          text-align: left;
          flex-direction: column;
          align-items: center;      
        }
    `]
})
export class AboutComponent {

}
