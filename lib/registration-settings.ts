import { connectToDatabase } from '@/lib/mongodb';

export type RegistrationPageKey = 'register100' | 'register-support';

export interface RegistrationSettings {
  register100Open: boolean;
  registerSupportOpen: boolean;
  updatedAt: Date;
  updatedBy?: string;
}

const COLLECTION_NAME = 'system_settings';
const DOCUMENT_KEY = 'registration_settings';

function getDefaultSettings(): RegistrationSettings {
  return {
    register100Open: true,
    registerSupportOpen: true,
    updatedAt: new Date(),
  };
}

export async function getRegistrationSettings(): Promise<RegistrationSettings> {
  const { db } = await connectToDatabase();
  const collection = db.collection(COLLECTION_NAME);

  const existing = await collection.findOne<{ value?: Partial<RegistrationSettings> }>({
    key: DOCUMENT_KEY,
  });

  if (!existing?.value) {
    const defaults = getDefaultSettings();
    await collection.updateOne(
      { key: DOCUMENT_KEY },
      {
        $set: {
          key: DOCUMENT_KEY,
          value: defaults,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );
    return defaults;
  }

  return {
    ...getDefaultSettings(),
    ...existing.value,
    updatedAt: existing.value.updatedAt ? new Date(existing.value.updatedAt) : new Date(),
  };
}

export async function updateRegistrationStatus(
  page: RegistrationPageKey,
  isOpen: boolean,
  updatedBy?: string
): Promise<RegistrationSettings> {
  const { db } = await connectToDatabase();
  const collection = db.collection(COLLECTION_NAME);
  const current = await getRegistrationSettings();

  const nextSettings: RegistrationSettings = {
    ...current,
    register100Open: page === 'register100' ? isOpen : current.register100Open,
    registerSupportOpen: page === 'register-support' ? isOpen : current.registerSupportOpen,
    updatedAt: new Date(),
    updatedBy,
  };

  await collection.updateOne(
    { key: DOCUMENT_KEY },
    {
      $set: {
        key: DOCUMENT_KEY,
        value: nextSettings,
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  );

  return nextSettings;
}

export function isRegistrationOpen(
  settings: RegistrationSettings,
  page: RegistrationPageKey
): boolean {
  return page === 'register100' ? settings.register100Open : settings.registerSupportOpen;
}
