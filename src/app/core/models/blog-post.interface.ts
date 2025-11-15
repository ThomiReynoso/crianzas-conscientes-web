export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedDate: Date;
  updatedDate?: Date;
  imageUrl: string;
  category: BlogCategory;
  tags: string[];
  readingTime: number; // in minutes
  featured?: boolean;
}

export enum BlogCategory {
  CRIANZA = 'Crianza Consciente',
  DISCIPLINA = 'Disciplina Positiva',
  EMOCIONES = 'Gestión Emocional',
  DESARROLLO = 'Desarrollo Infantil',
  FAMILIA = 'Vida Familiar',
  RECURSOS = 'Recursos y Herramientas'
}
