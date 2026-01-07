'use client';

import { WorkCard, useStore } from '@/store/useStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImagePlus, User, Minus } from 'lucide-react';
import { useRef } from 'react';

export default function WorkCardItem({ data }: { data: WorkCard }) {
  const { updateWork, deleteWork } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 处理图片上传转 Base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // 关键点：reader.result 可能是 string | ArrayBuffer
        // 我们需要确保它是 string (base64)
        const base64String = reader.result as string;
        updateWork(data.id, 'poster', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="relative p-4 border-2 border-black/80 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white">
      {/* 右上角删除按钮 */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-6 w-6 border border-black hover:bg-red-100"
        onClick={() => deleteWork(data.id)}
      >
        <Minus size={14} />
      </Button>

      <div className="flex gap-4">
        {/* 左侧：海报区域 */}
        <div 
          className="w-1/3 flex flex-col gap-2 cursor-pointer group"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="aspect-[3/4] border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50 relative">
            {data.poster ? (
              <img src={data.poster} alt="poster" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center text-gray-400 p-2">
                <ImagePlus className="mx-auto mb-1" />
                <span className="text-xs">点击上传</span>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageUpload} 
            />
          </div>
          {/* 下方台词输入框 */}
          <Input 
            placeholder="台词..." 
            value={data.lines}
            // 明确指定泛型 K，或者让 TS 自动推断
            onChange={(e) => updateWork(data.id, 'lines', e.target.value)}
            className="h-8 text-xs border-black"
          />
        </div>

        {/* 右侧：信息区域 */}
        <div className="w-2/3 flex flex-col gap-2">
          <Input 
            placeholder="片名" 
            className="font-bold border-black h-9"
            value={data.title}
            onChange={(e) => updateWork(data.id, 'title', e.target.value)}
          />
          
          <Input 
            placeholder="主创/演员" 
            className="text-sm border-black h-8"
            value={data.cast}
            onChange={(e) => updateWork(data.id, 'cast', e.target.value)}
          />

          <Textarea 
            placeholder="剧情梗概..." 
            className="flex-1 text-xs border-black resize-none min-h-[80px]"
            value={data.summary}
            onChange={(e) => updateWork(data.id, 'summary', e.target.value)}
          />

          {/* 人物萌点 */}
          <div className="flex justify-end mt-auto">
            <div className="relative">
              <Button 
                variant="outline" 
                size="sm" 
                // data.isHighlight 是 boolean，与 value 匹配
                className={`border-black h-7 text-xs flex gap-1 ${data.isHighlight ? 'bg-pink-100' : ''}`}
                onClick={() => updateWork(data.id, 'isHighlight', !data.isHighlight)}
              >
                <User size={12} />
                {data.character || '人物'}
              </Button>
               {data.isHighlight && (
                  <Input 
                    className="absolute bottom-8 right-0 w-24 h-6 text-xs bg-white z-10 border-black"
                    placeholder="输入人物"
                    value={data.character}
                    onChange={(e) => updateWork(data.id, 'character', e.target.value)}
                    autoFocus
                  />
               )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}