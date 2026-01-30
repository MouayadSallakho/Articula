// heroSlidesData.js
import slide1 from "../assets/images/homepage.png";
import slide2 from "../assets/images/homepage.png";
import slide3 from "../assets/images/homepage.png";
import slide4 from "../assets/images/homepage.png";

import feather from "../assets/images/feather.png" 
import artical1 from "../assets/images/articale1.png"
import artical2 from "../assets/images/articale2.png"
import artical3 from "../assets/images/articale3.png"
import artical4 from "../assets/images/articale4.png"


import writer1 from "../assets/images/person1.jpg"
import writer2 from "../assets/images/person2.jpg"
import writer3 from "../assets/images/person3.jpg"
import writer4 from "../assets/images/person4.jpg"
import writer5 from "../assets/images/person5.jpg"
import writer6 from "../assets/images/person6.jpg"


import our1 from "../assets/images/our1.png"
import our2 from "../assets/images/our2.png"
import our3 from "../assets/images/our3.png"
import our4 from "../assets/images/our4.png"

export const MyData = [
  {
    id: "s1",
    title: "Articula - Your Gateway  to Premium Articles",
    desc:
      "Discover high-quality articles written by experts and creators in various scientific and technical fields. Join a community of readers and writers and explore exclusive, knowledge-driven content.",
    ctas: [
      { label: "Start Reading", to: "/blog" },
      { label: "Create Account", to: "/register" },
    ],
    image: slide1,
  },
  {
    id: "s2",
    title: "Articula - Your Gateway  to Premium Articles",
    desc:
      "Discover high-quality articles written by experts and creators in various scientific and technical fields. Join a community of readers and writers and explore exclusive, knowledge-driven content.",
   
    ctas: [
      { label: "Start Reading", href: "#read" },
      { label: "Create Account", href: "#signup" },
    ],
    image: slide2,
  },
  {
    id: "s3",
   title: "Articula - Your Gateway  to Premium Articles",
     desc:
      "Discover high-quality articles written by experts and creators in various scientific and technical fields. Join a community of readers and writers and explore exclusive, knowledge-driven content.",
   
      ctas: [
      { label: "Start Reading", href: "#read" },
      { label: "Create Account", href: "#signup" },
    ],
    image: slide3,
  },
  {
    id: "s4",
    title: "Articula - Your Gateway  to Premium Articles",
    desc:
      "Discover high-quality articles written by experts and creators in various scientific and technical fields. Join a community of readers and writers and explore exclusive, knowledge-driven content.",
   
    ctas: [
      { label: "Start Reading", href: "#read" },
      { label: "Create Account", href: "#signup" },
    ],
    image: slide4,
  },
];


export const DataArts=[
  {
    id:1,
    image:artical1,
    typeArtical : "Science",
    title :"2023 JavaScript Masterclass: From Beginner to Pro Developer..." ,
    imageForAuther :feather , 
     nameOfAuther : "Shourouk AL Badawi"
  },
    {
    id:2,
    image:artical2,
    typeArtical : "Science",
    title :"Complete React Guide 2024: Build Modern Web Apps from Scratch..." ,
    imageForAuther :feather , 
    nameOfAuther : "Mouayad Sallakho"
  },
    {
    id:3,
    image:artical3,
    typeArtical : "Science",
    title :"Data Analysis with Python: From Basics to Advanced Techniques..." ,
    imageForAuther :feather , 
     nameOfAuther : "Shourouk Al Badawi"
  },
    {
    id:4,
    image:artical4,
    typeArtical : "Science",
    title :"Mastering HTML & CSS: Design Beautiful Websites Step by Step..." ,
    imageForAuther :feather , 
     nameOfAuther : "Mouayad Sallakho"
  }
]




export const Top_writer = [
  {
        id:1,
    image:writer2,
    title :"Mastering HTML & CSS: Design Beautiful Websites Step by Step..." ,
    imageForAuther :feather , 
     nameOfAuther : "Mouayad Sallakho",
     percent : "4.7",
     numberArts : "17"
  },
    {
        id:2,
    image:writer1,
    title :"Data Analysis with Python: From Basics to Advanced Techniques..." ,
    imageForAuther :feather , 
     nameOfAuther : "Shourouk Al Badawi",
     percent : "4.3",
     numberArts : "12"
  },
 {
        id:3,
    image:writer3,
    title :"2023 JavaScript Masterclass: From Beginner to Pro Developer..." ,
    imageForAuther :feather , 
     nameOfAuther : "Mouayad Sallakho",
     percent : "4.7",
     numberArts : "17"
  },
    {
        id:4,
    image:writer4,
    title :"Complete React Guide 2024: Build Modern Web Apps from Scratch..." ,
    imageForAuther :feather , 
     nameOfAuther : "Shourouk Al Badawi",
     percent : "4.3",
     numberArts : "22"
  },
  {
          id:5,
    image:writer5,
    title :"Mastering HTML & CSS: Design Beautiful Websites Step by Step..." ,
    imageForAuther :feather , 
     nameOfAuther : "Mouayad Sallakho",
     percent : "4.7",
     numberArts : "11"
  },
    {
        id:6,
    image:writer6,
    title :"Data Analysis with Python: From Basics to Advanced Techniques..." ,
    imageForAuther :feather , 
     nameOfAuther : "Shourouk Al Badawi",
     percent : "4.3",
     numberArts : "14"
  }
]

export const ourJob = [
  {
    id: 1,
    ourimage: our1,
    badge: "Featured",
    price: "$300",
    period: "/ Month",
    title: "System Analysis",
    experience: "2 Years of experience",
    tags: ["Part Time", "Senior", "Full Time"],
  },
  {
    id: 2,
    ourimage: our4,
    badge: "Popular",
    price: "$450",
    period: "/ Month",
    title: "Business Process Optimization",
    experience: "3 Years of experience",
    tags: ["Full Time", "Mid-Level"],
  },
  {
    id: 3,
    ourimage: our2,
    badge: "Recommended",
    price: "$550",
    period: "/ Month",
    title: "Data Analysis & Reporting",
    experience: "4 Years of experience",
    tags: ["Part Time", "Senior"],
  },
  {
    id: 4,
    ourimage: our1,
    badge: "Premium",
    price: "$700",
    period: "/ Month",
    title: "Technical Solution Architecture",
    experience: "5+ Years of experience",
    tags: ["Full Time", "Senior"],
  },
    {
    id: 5,
    ourimage: our4,
    badge: "Featured",
    price: "$300",
    period: "/ Month",
    title: "System Analysis",
    experience: "2 Years of experience",
    tags: ["Part Time", "Senior", "Full Time"],
  },
  {
    id: 6,
    ourimage: our3,
    badge: "Popular",
    price: "$450",
    period: "/ Month",
    title: "Business Process Optimization",
    experience: "3 Years of experience",
    tags: ["Full Time", "Mid-Level"],
  },
  {
    id: 7,
    ourimage: our1,
    badge: "Recommended",
    price: "$550",
    period: "/ Month",
    title: "Data Analysis & Reporting",
    experience: "4 Years of experience",
    tags: ["Part Time", "Senior"],
  },
  {
    id: 8,
    ourimage: our4,
    badge: "Premium",
    price: "$700",
    period: "/ Month",
    title: "Technical Solution Architecture",
    experience: "5+ Years of experience",
    tags: ["Full Time", "Senior"],
  }
]


export const TopTest = [
  {
    id:1,
    title:"In total, it was a big success, I would get emails about what a fantastic resource it was.",
    parag:"Ted Sarandos",
    spans:"Chief Executive Officer of Netflix"
  },
    {
    id:2,
    title:"In total, it was a big success, I would get emails about what a fantastic resource it was.",
    parag:"Ted Sarandos",
    spans:"Chief Executive Officer of Netflix"
  },
    {
    id:3,
    title:"In total, it was a big success, I would get emails about what a fantastic resource it was.",
    parag:"Ted Sarandos",
    spans:"Chief Executive Officer of Netflix"
  },
    {
    id:4,
    title:"In total, it was a big success, I would get emails about what a fantastic resource it was.",
    parag:"Ted Sarandos",
    spans:"Chief Executive Officer of Netflix"
  },
    {
    id:5,
    title:"In total, it was a big success, I would get emails about what a fantastic resource it was.",
    parag:"Ted Sarandos",
    spans:"Chief Executive Officer of Netflix"
  },
    {
    id:6,
    title:"In total, it was a big success, I would get emails about what a fantastic resource it was.",
    parag:"Ted Sarandos",
    spans:"Chief Executive Officer of Netflix"
  },
]