import { prisma as prismadb } from '@/lib/prisma';
import { SettingForm } from '@/schemas/settings';
import { WithRequiredProperty } from '@/types/util';

export async function createSetting(newSetting: SettingForm) {
  return prismadb.setting.create({
    data: newSetting,
  });
}

export async function updateSetting(setting: WithRequiredProperty<SettingForm, 'id'>) {
  return prismadb.setting.update({
    where: { id: setting.id },
    data: setting,
  });
}
