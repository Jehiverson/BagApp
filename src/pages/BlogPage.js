import { Helmet } from 'react-helmet-async';
import { Button, Container, Stack, Typography } from '@mui/material';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Estilos del calendario
import { BlogPostsSort, BlogPostsSearch } from '../sections/@dashboard/blog';
import Iconify from '../components/iconify';
import POSTS from '../_mock/blog';

// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Popular' },
  { value: 'oldest', label: 'Oldest' },
];

// ----------------------------------------------------------------------

export default function BlogPage() {
  const localizer = momentLocalizer(moment);
  const events = POSTS.map((post) => ({
    title: post.title,
    start: new Date(post.date), // Asegúrate de que "post.date" sea una fecha válida
    end: new Date(post.date),   // Puedes ajustar esto según tus necesidades
  }));
  
  return (
    <>
      <Helmet>
        <title> Actividades </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Actividades
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            New Post
          </Button>
        </Stack>

        <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          <BlogPostsSearch posts={POSTS} />
          <BlogPostsSort options={SORT_OPTIONS} />
        </Stack>

        {/* Renderizar el calendario */}
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }} // Ajusta la altura según tus necesidades
        />
      </Container>
    </>
  );
}
