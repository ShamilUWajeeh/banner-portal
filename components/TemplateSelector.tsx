'use client';

interface Template {
    id: string;
    name: string;
    description: string;
    thumbnail: string;
    aspectRatio: string;
}

interface TemplateSelectorProps {
    selectedTemplate: string | null;
    onSelect: (templateId: string) => void;
}

export default function TemplateSelector({ selectedTemplate, onSelect }: TemplateSelectorProps) {
    const templates: Template[] = [
        {
            id: 'template1',
            name: 'Classic Portrait',
            description: 'Single candidate, vertical layout (500×833)',
            thumbnail: '/template1.png',
            aspectRatio: '3/5' // Portrait
        },
        {
            id: 'template2',
            name: 'Team Grid',
            description: '9 candidates, horizontal layout (1200×400)',
            thumbnail: '/template2.png',
            aspectRatio: '3/1' // Landscape banner
        }
    ];

    return (
        <div className="w-full max-w-5xl mx-auto p-6">
            <h2 className="text-3xl font-bold text-center mb-2">Select Banner Template</h2>
            <p className="text-gray-600 text-center mb-8">Choose a template to customize your banner</p>

            <div className="flex flex-col gap-6">
                {templates.map((template) => (
                    <button
                        key={template.id}
                        onClick={() => onSelect(template.id)}
                        className={`group relative overflow-hidden rounded-xl border-3 transition-all duration-300 hover:shadow-2xl ${selectedTemplate === template.id
                            ? 'border-blue-500 shadow-xl scale-[1.02]'
                            : 'border-gray-300 hover:border-blue-400'
                            }`}
                    >
                        <div className="flex flex-col md:flex-row gap-4 p-6 bg-white">
                            {/* Thumbnail Preview */}
                            <div
                                className="flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden shadow-inner border border-gray-200"
                                style={{
                                    aspectRatio: template.aspectRatio,
                                    width: template.id === 'template1' ? '240px' : '100%',
                                    maxWidth: template.id === 'template2' ? '600px' : undefined
                                }}
                            >
                                <img
                                    src={template.thumbnail}
                                    alt={template.name}
                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                    onError={(e) => {
                                        // Fallback with proper aspect ratio
                                        const width = template.id === 'template1' ? '500' : '1200';
                                        const height = template.id === 'template1' ? '833' : '400';
                                        e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"%3E%3Crect fill="%23f3f4f6" width="${width}" height="${height}"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial" font-size="24" fill="%239ca3af" text-anchor="middle" dominant-baseline="middle"%3E${template.name}%3C/text%3E%3C/svg%3E`;
                                    }}
                                />
                            </div>

                            {/* Info */}
                            <div className="flex-1 flex flex-col justify-center text-left">
                                <h3 className="font-bold text-2xl mb-2 text-gray-800">{template.name}</h3>
                                <p className="text-base text-gray-600 mb-3">{template.description}</p>
                                <div className="flex items-center gap-2">
                                    <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold">
                                        {template.id === 'template1' ? '📱 Portrait' : '🖥️ Landscape Banner'}
                                    </span>
                                    {selectedTemplate === template.id && (
                                        <span className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm font-bold">
                                            ✓ Selected
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Hover Effect */}
                        <div className="absolute inset-0 border-2 border-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>
                    </button>
                ))}
            </div>
        </div>
    );
}
