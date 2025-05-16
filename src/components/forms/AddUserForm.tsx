import { Button, Field, Flex, Input } from "@chakra-ui/react"
import { useFormik } from "formik"
import { toFormikValidationSchema } from "zod-formik-adapter"

import { useI18n } from "@/locales/client"
import { User, userEditFormSchema, UserForm, userFormSchema } from "@/schemas/user"
import { useUserMutation } from "@/hooks/api/useUserMutation"
import { FormProps } from "@/types/form"

export default function AddUserForm({
  initialData,
  onSaved,
  onCancel,
}: FormProps<UserForm | User, User>) {
  const isEditing = !!initialData?.id
  const mutation = useUserMutation()
  const t = useI18n()

  const formik = useFormik({
    initialValues: {
      email: initialData?.email || "",
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      phone: initialData?.phone || "",
      password: "",
      roleId: "",
    },
    validationSchema: toFormikValidationSchema(isEditing ? userEditFormSchema : userFormSchema),
    onSubmit: async (savingUser) => {
      console.log("saving user", savingUser)
    },
    enableReinitialize: true,
  })

  return (
    <form autoComplete="one-time-code" onSubmit={formik.handleSubmit}>
      <Flex gap="10" mb={2}>
        <Field.Root
          required={!isEditing}
          invalid={!!formik.errors.firstName && formik.touched.firstName}
        >
          <Field.Label htmlFor="firstName">{t("user.form.first-name")}</Field.Label>
          <Input
            id="firstName"
            name="firstName"
            type="text"
            variant="outline"
            onChange={formik.handleChange}
            value={formik.values.firstName}
          />
          <Field.ErrorText>{formik.errors.firstName}</Field.ErrorText>
        </Field.Root>
        <Field.Root
          required={!isEditing}
          invalid={!!formik.errors.lastName && formik.touched.lastName}
        >
          <Field.Label htmlFor="lastName">{t("user.form.last-name")}</Field.Label>
          <Input
            id="lastName"
            name="lastName"
            type="text"
            variant="outline"
            onChange={formik.handleChange}
            value={formik.values.lastName}
          />
          <Field.ErrorText>{formik.errors.lastName}</Field.ErrorText>
        </Field.Root>
      </Flex>
      <Flex gap="10" mb={2}>
        <Field.Root
          required
          disabled={isEditing}
          invalid={!!formik.errors.email && formik.touched.email}
        >
          <Field.Label htmlFor="email">{t("common.email")}</Field.Label>
          <Input
            id="email"
            name="email"
            type="text"
            variant="outline"
            onChange={formik.handleChange}
            value={formik.values.email}
            autoComplete="off"
          />
          <Field.ErrorText>{formik.errors.email}</Field.ErrorText>
        </Field.Root>
        <Field.Root required={!isEditing} invalid={!!formik.errors.phone && formik.touched.phone}>
          <Field.Label htmlFor="phone">{t("common.phone")}</Field.Label>
          <Input
            id="phone"
            name="phone"
            type="phone"
            variant="outline"
            onChange={formik.handleChange}
            value={formik.values.phone}
            autoComplete="off"
          />
          <Field.ErrorText>{formik.errors.phone}</Field.ErrorText>
        </Field.Root>
      </Flex>
      {/* <Flex gap={10} mb={2}>
        <Field.Root required invalid={!!formik.errors.roleId && formik.touched.roleId}>
          <Field.Label htmlFor="role">{t("user.form.role")}</Field.Label>
          <NativeSelect<Role>
            id="language"
            data={roles}
            nameField="name"
            valueField="id"
            onSelected={(value: Role) => formik.setFieldValue("roleId", value.id)}
            selectedValue={formik.values.roleId}
          />
          <Field.ErrorText>{formik.errors.roleId}</Field.ErrorText>
        </Field.Root>

        <Field.Root
          required={!isEditing}
          invalid={!!formik.errors.password && formik.touched.password}
        >
          <Field.Label htmlFor="password">{t("user.form.password")}</Field.Label>
          <Input
            id="password"
            name="password"
            type="password"
            variant="outline"
            onChange={formik.handleChange}
            value={formik.values.password}
            autoComplete="off"
          />
          <Field.ErrorText>{formik.errors.password}</Field.ErrorText>
        </Field.Root>
      </Flex> */}
      <Flex mt={5} mb={5} gap={3}>
        <Button type="submit" loading={mutation.isPending} loadingText="loading">
          {t("button.submit")}
        </Button>
        {onCancel ? (
          <Button variant="outline" onClick={onCancel}>
            {t("button.cancel")}
          </Button>
        ) : null}
      </Flex>
    </form>
  )
}
