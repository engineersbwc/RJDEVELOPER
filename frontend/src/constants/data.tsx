import React from 'react';
import { DraftingCompass, Layers, Calculator, ClipboardList, Users, HardHat, Home, Building2, Factory, Palette, Wrench, Ruler, FileSpreadsheet, FileCheck2 } from "lucide-react";

export const SERVICES = [
  {
    title: "2D & 3D DESIGN",
    description: "Conceptual Planning, Layouts, Walkthroughs & Renders",
    icon: <div className="flex gap-1 text-accent"><DraftingCompass className="w-8 h-8" /><Layers className="w-8 h-8 opacity-50" /></div>,
  },
  {
    title: "BUILDING ESTIMATIONS",
    description: "Detailed Cost Calculation, Material Quantities, and Budget Planning",
    icon: <div className="flex gap-1 text-accent"><Calculator className="w-8 h-8" /><ClipboardList className="w-8 h-8 opacity-50" /></div>,
  },
  {
    title: "CONSULTANCY SERVICES",
    description: "Project Guidance, Expert Advice, Site Supervision & Management",
    icon: <div className="flex gap-1 text-accent"><Users className="w-8 h-8" /><HardHat className="w-8 h-8 opacity-50" /></div>,
  },
];

export const PROJECTS = [
  { id: 1, title: "06 Marla Signature Villas (2x)", category: "Residential", image: "/6_marla_villa.png" },
  { id: 2, title: "07 Marla Modern Villas (3x)", category: "Residential", image: "/7_marla_villa.png" },
  { id: 3, title: "08 Marla Villas", category: "Residential", image: "/8_marla_villa.png" },
  { id: 4, title: "10 Marla Villas (2x)", category: "Residential", image: "/10_marla_villa.png" },
  { id: 5, title: "10 Marla Premium Villas", category: "Residential", image: "/10_marla_premium.png" },
  { id: 6, title: "1 Kanal Eco Villas (2x)", category: "Residential", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800" },
  { id: 8, title: "32 Marla Modern House", category: "Residential", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800" },
];

export const ESTIMATION_RATES = [
  {
    id: "01",
    title: "RESIDENTIAL BUILDINGS",
    subtitle: "Houses, Villas, Apartments (Grey Structure)",
    services: "BOQ, Cost Estimate, Material Take-off, Labour Cost, Summary",
    price: "Rs. 5,000 - Rs. 15,000",
    unit: "(Per Marla)",
    icon: <Home className="w-8 h-8" />
  },
  {
    id: "02",
    title: "COMMERCIAL BUILDINGS",
    subtitle: "Plazas, Malls, Offices (Grey Structure)",
    services: "BOQ, Cost Estimate, Material Take-off, Labour Cost, Summary",
    price: "Rs. 8,000 - Rs. 20,000",
    unit: "(Per Marla)",
    icon: <Building2 className="w-8 h-8" />
  },
  {
    id: "03",
    title: "INDUSTRIAL BUILDINGS",
    subtitle: "Factories, Warehouses",
    services: "BOQ, Cost Estimate, Material Take-off, Labour Cost, Summary",
    price: "Rs. 2 - Rs. 5",
    unit: "(Per Sq. Ft)",
    icon: <Factory className="w-8 h-8" />
  },
  {
    id: "04",
    title: "INTERIOR DESIGNS",
    subtitle: "Home, Office, Shop Interiors",
    services: "BOQ, Cost Estimate, Material Take-off, Labour Cost, Summary",
    price: "Rs. 3 - Rs. 8",
    unit: "(Per Sq. Ft)",
    icon: <Palette className="w-8 h-8" />
  },
  {
    id: "05",
    title: "MEP PROJECTS",
    subtitle: "Electrical, Plumbing, HVAC (Domestic & Commercial)",
    services: "BOQ, Cost Estimate, Material Take-off, Labour Cost, Summary",
    price: "Rs. 2,000 - Rs. 8,000",
    unit: "(Per Marla)",
    icon: <Wrench className="w-8 h-8" />
  },
  {
    id: "06",
    title: "IPC / RAR",
    subtitle: "Contractor Billing & Measurement Sheets",
    services: "Interim Payment Certificate, Running Account Bill, MB Preparation",
    price: "0.2% - 0.5%",
    unit: "(Of Project Cost)",
    icon: <Ruler className="w-8 h-8" />
  },
  {
    id: "07",
    title: "RATE ANALYSIS",
    subtitle: "Per item cost breakdown",
    services: "Material, Labour & Equipment Cost Analysis per unit (e.g. cu.ft, sq.ft, rft)",
    price: "Rs. 500 - Rs. 2,000",
    unit: "(Per Item)",
    icon: <FileSpreadsheet className="w-8 h-8" />
  },
  {
    id: "08",
    title: "TENDER / BID ESTIMATION",
    subtitle: "Bidding documents & BOQ preparation",
    services: "Complete BOQ pricing for bidding purpose based on drawings & specs",
    price: "0.05% - 0.15%",
    unit: "(Of Estimated Bid Value)",
    icon: <FileCheck2 className="w-8 h-8" />
  }
];

export const TEAM_MEMBERS = [
  {
    name: "John Doe",
    role: "Chief Executive Officer",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800",
    description: "20+ years of experience in leading major construction projects."
  },
  {
    name: "Sarah Jenkins",
    role: "Lead Architect",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
    description: "Award-winning designer with a passion for sustainable architecture."
  },
  {
    name: "Michael Chen",
    role: "Project Manager",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800",
    description: "Ensures flawless execution and timely delivery of complex builds."
  }
];

export const TESTIMONIALS = [
  {
    name: "David Smith",
    company: "Smith Holdings",
    feedback: "RJ Developer transformed our vision into reality. Their professionalism and adherence to deadlines is unmatched.",
    rating: 5
  },
  {
    name: "Elena Rodriguez",
    company: "Private Homeowner",
    feedback: "Building our dream home was a seamless experience. The quality of materials and attention to detail was exceptional.",
    rating: 5
  },
  {
    name: "James Wilson",
    company: "Wilson & Co. Retail",
    feedback: "The commercial plaza they constructed for us has become a landmark. Highly recommend their corporate services.",
    rating: 5
  }
];
