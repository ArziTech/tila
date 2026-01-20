import { z } from "zod";

export const environmentSchema = z.object({
  NEXTAUTH_SECRET: z.string(),
  NODE_ENV: z.string(),
});

export type Environment = z.infer<typeof environmentSchema>;

export function validateEnv(env: NodeJS.ProcessEnv) {
  const result = environmentSchema.safeParse(env);

  if (!result.success) {
    const missingKeys = result.error.issues.map(
      (issue) => issue.path[0] as string,
    );

    const clientEnvs = missingKeys.filter((key) =>
      key.startsWith("NEXT_PUBLIC_"),
    );

    const serverEnvs = missingKeys.filter(
      (key) => !key.startsWith("NEXT_PUBLIC_"),
    );

    const totalMissing = missingKeys.length;

    const message = `
❌ ENVIRONMENT VARIABLE VALIDATION FAILED

Total Missing: ${totalMissing}
- Client (NEXT_PUBLIC_*): ${clientEnvs.length}
- Server: ${serverEnvs.length}

${clientEnvs.length > 0 ? `🟡 Client Envs Missing:\n${clientEnvs.map((v) => `  - ${v}`).join("\n")}\n` : ""}
${serverEnvs.length > 0 ? `🔴 Server Envs Missing:\n${serverEnvs.map((v) => `  - ${v}`).join("\n")}\n` : ""}

ℹ️  Tips:
- Client env harus diawali dengan NEXT_PUBLIC_
- Pastikan file .env sudah dimuat dengan benar
- Restart dev server setelah mengubah .env
`.trim();

    throw new Error(message);
  }

  return result.data;
}

// ✅ dieksekusi otomatis saat app start
export const env = validateEnv(process.env);
