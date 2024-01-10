module.exports = {
  extends: ['@commitlint/config-conventional'],
  prompt: {
    settings: {
      enableMultipleScopes: true, // 支持多scope
      scopeEnumSeparator: ',' // 多scope分隔符
    },
    messages: {
      skip: '<可跳过>',
      max: '最多输入 %d 个字符',
      min: '至少需要输入 %d 个字符',
      emptyWarning: '不能为空',
      upperLimitWarning: '超过长度限制',
      lowerLimitWarning: '未达到最少数字要求'
    },
    questions: {
      type: {
        description: '选择你要提交的信息类型 ',
        enum: {
          feat: {
            description: '新功能',
            title: 'Features',
            emoji: '✨'
          },
          fix: {
            description: '修复bug',
            title: 'Bug Fixes',
            emoji: '🐛'
          },
          docs: {
            description: '书写文档',
            title: 'Documentation',
            emoji: '📚'
          },
          style: {
            description: '代码格式化(空格, 格式化, 分号等)',
            title: 'Styles',
            emoji: '💎'
          },
          refactor: {
            description: '代码重构',
            title: 'Code Refactoring',
            emoji: '📦'
          },
          perf: {
            description: '性能优化提升',
            title: 'Performance Improvements',
            emoji: '🚀'
          },
          test: {
            description: '测试',
            title: 'Tests',
            emoji: '🚨'
          },
          build: {
            description: '调整构建或者依赖',
            title: 'Builds',
            emoji: '🛠'
          },
          ci: {
            description: '调整持续集成',
            title: 'Continuous Integrations',
            emoji: '⚙️'
          },
          chore: {
            description: '变更构建流程或者辅助工具',
            title: 'Chores',
            emoji: '♻️'
          },
          revert: {
            description: '代码回退',
            title: 'Reverts',
            emoji: '🗑'
          }
        }
      },
      scope: {
        description: '提交信息类型(模块、组件、页面)'
      },
      subject: {
        description: '简洁明了的修改摘要'
      },
      body: {
        description: '详细的调整信息描述'
      },
      isBreaking: {
        description: '是否有非兼容性的调整？'
      },
      breaking: {
        description: '请输入非兼容调整的详细描述'
      },
      isIssueAffected: {
        description: '是否有关闭 issue'
      },
      issues: {
        description: '列举关闭的 issue (例如 "fix #123", "re #123")'
      }
    }
  }
};
