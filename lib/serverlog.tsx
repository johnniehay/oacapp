"use server"

export async function logServerError(...error: unknown[]) {
  console.log("got serveraction error")
  console.error(...error);
}