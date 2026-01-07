'use client';

import { useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';
import WorkCardItem from '@/components/WorkCardItem';
import { Button } from '@/components/ui/button';
import { Plus, Download, RefreshCcw, Trash } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function Home() {
  const { works, addWork, setWorks } = useStore();
  const contentRef = useRef<HTMLDivElement>(null); // 用于捕获生成PDF的区域

  // 初始化或从后端加载模板 (可选)
  const loadTemplates = async () => {
    if (confirm('这将覆盖当前未保存的内容，确定加载模板吗？')) {
      const res = await fetch('/api/templates');
      const data = await res.json();
      setWorks(data);
    }
  };

  // 导出 PDF 功能
  const exportPDF = async () => {
    if (!contentRef.current) return;
    
    // 临时调整样式以确保PDF渲染完整 (去除滚动条等)
    const originalStyle = contentRef.current.style.cssText;
    contentRef.current.style.width = '1200px'; // 强制桌面宽度以保证排版
    
    try {
      const canvas = await html2canvas(contentRef.current, {
        scale: 2, // 提高清晰度
        useCORS: true, // 允许跨域图片
        backgroundColor: '#f8f9fa' // 背景色
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('my-works-list.pdf');
    } catch (err) {
      console.error('导出失败', err);
      alert('导出失败，请检查图片是否跨域');
    } finally {
      // 恢复样式
      contentRef.current.style.cssText = originalStyle;
    }
  };

  return (
    <main className="min-h-screen bg-stone-100 p-4 md:p-8 flex flex-col gap-6">
      {/* 顶部控制栏 */}
      <header className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="w-full md:w-1/2">
            <h1 className="text-xl font-bold mb-2">前言...</h1>
            <p className="text-gray-500 text-sm">在这里记录你看过的作品，生成你的专属片单。</p>
        </div>
        <div className="flex gap-3">
            <Button onClick={exportPDF} variant="outline" className="border-black hover:bg-stone-200">
                <Download className="mr-2 h-4 w-4" /> 导出 PDF
            </Button>
            {/* 这里的查看回收站暂时做成清空，你可以后续扩展成真正的回收站页面 */}
            <Button variant="outline" className="border-black hover:bg-stone-200">
                <Trash className="mr-2 h-4 w-4" /> 查看回收站
            </Button>
            <Button onClick={loadTemplates} variant="ghost" size="sm">
                <RefreshCcw className="h-4 w-4" /> 载入模板
            </Button>
        </div>
      </header>

      {/* 主要内容区域 - 网格布局 */}
      {/* ref={contentRef} 用于 PDF 截图
          grid-cols-1: 手机端单列
          md:grid-cols-2: 平板双列
          lg:grid-cols-3: 桌面三列
      */}
      <div 
        ref={contentRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20 p-4"
      >
        {works.map((work) => (
          <WorkCardItem key={work.id} data={work} />
        ))}

        {/* 添加按钮卡片 */}
        <div 
          onClick={addWork}
          className="min-h-[250px] flex items-center justify-center border-2 border-dashed border-gray-400 rounded-xl cursor-pointer hover:bg-white hover:border-black transition-all group"
        >
          <div className="text-center text-gray-400 group-hover:text-black">
             <Plus size={64} className="mx-auto" />
             <span className="text-lg mt-2 block">添加你喜欢的</span>
          </div>
        </div>
      </div>

      {/* 手机端浮动添加按钮 (可选，设计图右侧似乎是独立的手机视图，这里用响应式处理) */}
      <div className="md:hidden fixed bottom-6 right-6">
        <Button 
            onClick={addWork} 
            className="h-14 w-14 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-white text-black hover:bg-stone-100"
        >
            <Plus size={30} />
        </Button>
      </div>

    </main>
  );
}