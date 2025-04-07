import React from 'react';
import { Container, Typography, Paper, Divider, Link } from '@mui/material';

const About: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h3" gutterBottom sx={{ mb: 3 }}>
          À propos de MovieFlex
        </Typography>
        
        <Typography variant="body1" paragraph>
          MovieFlex est une plateforme dédiée aux amateurs de cinéma et de séries TV. Notre mission est de vous fournir des informations détaillées et à jour sur vos films et séries préférés.
        </Typography>
        
        <Typography variant="body1" paragraph>
          Cette application utilise l'API de TMDb (The Movie Database) pour récupérer des informations sur les films et séries les plus populaires, ainsi que pour vous permettre de rechercher vos titres préférés.
        </Typography>
        
        <Divider sx={{ my: 4 }} />
        
        <Typography variant="h5" gutterBottom>DMCA et Droits d'auteur</Typography>
        <Typography variant="body1" paragraph>
          MovieFlex respecte les droits de propriété intellectuelle d'autrui et demande à ses utilisateurs de faire de même. MovieFlex ne stocke aucun contenu protégé par copyright et se conforme strictement aux dispositions du Digital Millennium Copyright Act (DMCA).
        </Typography>
        
        <Typography variant="h5" gutterBottom>Législation</Typography>
        <Typography variant="body1" paragraph>
          MovieFlex opère en conformité avec toutes les lois applicables concernant la distribution d'informations relatives aux œuvres audiovisuelles. Nous nous engageons à fournir uniquement des métadonnées et des informations descriptives sur les films et séries TV.
        </Typography>
        
        <Typography variant="h5" gutterBottom>Copyright</Typography>
        <Typography variant="body1" paragraph>
          © 2025 MovieFlex. Tous droits réservés. Les données concernant les films et séries TV sont fournies par TMDb. MovieFlex n'est pas affilié à TMDb ou aux studios de production des œuvres référencées.
        </Typography>
        
        <Divider sx={{ my: 4 }} />
        
        <Typography variant="h5" gutterBottom>Contact</Typography>
        <Typography variant="body1">
          Pour toute question, suggestion ou signalement d'un problème, veuillez nous contacter à l'adresse suivante : <Link href="mailto:contact@movieflex.com">contact@movieflex.com</Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default About;