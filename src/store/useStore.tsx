import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// 定义卡片的数据接口
export interface WorkCard {
  id: string;
  title: string;       // 片名
  poster: string;      // 海报图片 (base64 或 URL)
  cast: string;        // 主创/演员
  summary: string;     // 剧情梗概
  lines: string;       // 台词
  character: string;   // 人物
  isHighlight: boolean; // 是否显示萌点 (对应设计图点击显示)
}

interface AppState {
  works: WorkCard[];
  addWork: () => void;
  updateWork: <K extends keyof WorkCard>(id: string, field: K, value: WorkCard[K]) => void; //泛型应用 K必须是WorkCard的key field占位
  deleteWork: (id: string) => void;
  setWorks: (works: WorkCard[]) => void; // 用于从后端加载模板
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      works: [],
      addWork: () => set((state) => ({
        works: [
          ...state.works,
          {
            id: crypto.randomUUID(),
            title: '',
            poster: '', // 默认为空或占位符
            cast: '',
            summary: '',
            lines: '',
            character: '',
            isHighlight: false,
          },
        ],
      })),
      updateWork: (id, field, value) => set((state) => ({
        works: state.works.map((w) => (w.id === id ? { ...w, [field]: value } : w)),
      })),
      deleteWork: (id) => set((state) => ({
        works: state.works.filter((w) => w.id !== id),
      })),
      setWorks: (works) => set({ works }),
    }),
    {
      name: 'work-storage', // localStorage 的 key
      storage: createJSONStorage(() => localStorage),
    }
  )
);