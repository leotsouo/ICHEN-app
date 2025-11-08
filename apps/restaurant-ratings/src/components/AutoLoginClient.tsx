"use client";
import { useEffect } from "react";

export default function AutoLoginClient() {
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const email = params.get("auto_login_email");
      if (!email) return;

      // Build a regular form and submit it to trigger the same flow as the UI
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "/auth/login";
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = "email";
      input.value = email;
      form.appendChild(input);
      document.body.appendChild(form);
      form.submit();
    } catch (e) {
      // ignore
    }
  }, []);

  return null;
}
