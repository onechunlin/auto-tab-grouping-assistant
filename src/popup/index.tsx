import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Form, Input, message, Space } from "antd"
import { useEffect } from "react"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import "./index.css"

import type { Group } from "~type"

function IndexPopup() {
  const [groups, setGroups] = useStorage<Group[]>(
    {
      key: "groups",
      instance: new Storage({
        copiedKeyList: ["shield-modulation"]
      })
    },
    [{ title: "", regExp: "" }]
  )
  const [form] = Form.useForm()

  const onFinish = (values: any) => {
    setGroups(values.groups)
    message.success("保存成功")
  }

  useEffect(() => {
    form.setFieldValue("groups", groups)
  }, [groups])

  return (
    <div className="container">
      <h3>分组规则</h3>
      <Form form={form} onFinish={onFinish}>
        <Form.List name="groups">
          {(fields, { add, remove, move }, { errors }) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => (
                <Space key={key} className="group" align="baseline">
                  <Form.Item {...restField} name={[name, "title"]}>
                    <Input placeholder="分组名称" />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, "regExp"]}>
                    <Input placeholder="URL 正则" />
                  </Form.Item>
                  {fields.length > 1 && (
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  )}
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="link"
                  onClick={() => add()}
                  icon={<PlusOutlined />}>
                  添加分组
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Button type="primary" htmlType="submit">
          保存配置
        </Button>
      </Form>
    </div>
  )
}

export default IndexPopup
