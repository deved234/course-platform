import { notFound } from "next/navigation";
import { apiFetch } from "@/lib/api";
import CourseDetailClient from "@/components/CourseDetailClient";

export default async function CoursePage(props) {
  const params = await props.params;
  const id = params.id;

  const [courseRes, lessonsRes] = await Promise.all([
    apiFetch(`/courses/${id}`),
    apiFetch(`/courses/${id}/lessons`),
  ]);

  if (courseRes.error || !courseRes.data) {
    notFound();
  }

  const lessons = lessonsRes.error ? [] : lessonsRes.data ?? [];

  return <CourseDetailClient courseId={id} initialCourse={courseRes.data} initialLessons={lessons} />;
}
