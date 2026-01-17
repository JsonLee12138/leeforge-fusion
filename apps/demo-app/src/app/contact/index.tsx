import { createSignal } from "solid-js";
import { createServerData } from "@leeforge/fusion/data";

export default function Contact() {
  const [name, setName] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [message, setMessage] = createSignal("");
  const [submitted, setSubmitted] = createSignal(false);
  const [submitting, setSubmitting] = createSignal(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setSubmitting(true);

    // 模拟表单提交到后端 API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("表单提交数据:", {
      name: name(),
      email: email(),
      message: message(),
    });

    setSubmitting(false);
    setSubmitted(true);

    // 重置表单
    setName("");
    setEmail("");
    setMessage("");

    // 3秒后隐藏成功消息
    setTimeout(() => setSubmitted(false), 3000);
  };

  const data = createServerData(async () => {
    return {
      title: "联系我们",
      email: "support@leeforge.com",
      phone: "+86 123 4567 8900",
    };
  });

  return (
    <div class="page">
      <h1>📧 联系我们</h1>
      <p style="color: #666; margin-bottom: 2rem;">
        有任何问题或建议？欢迎通过以下方式联系我们
      </p>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
        {/* 联系信息 */}
        <div>
          <div style="background: #f7fafc; padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem;">
            <h3 style="color: #2d3748; margin-bottom: 0.5rem;">📧 邮箱</h3>
            <p style="color: #4a5568;">{data()?.email}</p>
          </div>

          <div style="background: #f7fafc; padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem;">
            <h3 style="color: #2d3748; margin-bottom: 0.5rem;">📞 电话</h3>
            <p style="color: #4a5568;">{data()?.phone}</p>
          </div>

          <div style="background: #f7fafc; padding: 1.5rem; border-radius: 8px;">
            <h3 style="color: #2d3748; margin-bottom: 0.5rem;">📍 地址</h3>
            <p style="color: #4a5568;">
              北京市朝阳区
              <br />
              科技园区 A 座 1001 室
            </p>
          </div>
        </div>

        {/* 联系表单 */}
        <div>
          <form
            onSubmit={handleSubmit}
            style="background: #f7fafc; padding: 1.5rem; border-radius: 8px;"
          >
            <div class="form-group">
              <label>姓名</label>
              <input
                type="text"
                value={name()}
                onInput={(e: any) => setName(e.target.value)}
                required
                placeholder="请输入您的姓名"
              />
            </div>

            <div class="form-group">
              <label>邮箱</label>
              <input
                type="email"
                value={email()}
                onInput={(e: any) => setEmail(e.target.value)}
                required
                placeholder="请输入您的邮箱"
              />
            </div>

            <div class="form-group">
              <label>留言</label>
              <textarea
                value={message()}
                onInput={(e: any) => setMessage(e.target.value)}
                required
                rows={5}
                placeholder="请输入您的留言内容"
              />
            </div>

            <button
              type="submit"
              class="btn"
              disabled={submitting()}
              style="width: 100%;"
            >
              {submitting() ? "提交中..." : "发送消息"}
            </button>

            {submitted() && (
              <div class="success" style="margin-top: 1rem;">
                ✅ 消息发送成功！我们会尽快回复您。
              </div>
            )}
          </form>
        </div>
      </div>

      <div style="margin-top: 2rem; padding: 1rem; background: #f7fafc; border-radius: 8px;">
        <p style="color: #4a5568;">
          💡
          提示：这是一个演示表单，数据会发送到控制台。在实际项目中，您可以将表单数据提交到后端
          API。
        </p>
      </div>
    </div>
  );
}

export const loader = async () => {
  return {
    title: "联系我们",
  };
};

export const guards = [];
