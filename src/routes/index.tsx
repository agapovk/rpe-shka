import { createFileRoute } from "@tanstack/react-router";
import { HomeScreen } from "@/slices/manage-session";

export const Route = createFileRoute("/")({ component: HomeScreen });
