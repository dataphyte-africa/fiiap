import React from 'react';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { getAboutPageStats } from '@/lib/data/about-stats';

export default async function AboutPage() {
    const t = await getTranslations('aboutPage');
    const stats = await getAboutPageStats();

    return (
        <main className="min-h-screen  flex flex-col items-center w-full">
            {/* Hero Section */}
            <div className="bg-[url('/blog/blog-bg.png')] w-full bg-cover bg-center  text-white md:min-h-[50vh] flex flex-col justify-center items-center relative">
                <div className="absolute inset-0 bg-primary/45" />
                <div className="container mx-auto px-4 py-16 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            {t('hero.title')}
                        </h1>
                        <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
                            {t('hero.description')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Mission Section with Bento Grid */}
            <section className="w-full py-16 px-4 bg-gray-50">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Text Content */}
                        <div className="space-y-6">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                                {t('mission.title')}{' '}
                                <span className="text-gray-500">
                                    {t('mission.subtitle')}
                                </span>
                            </h2>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                {t('mission.description')}
                            </p>
                        </div>

                        {/* Bento Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                                    <Image
                                        src="/about/1.png"
                                        alt="Civil society collaboration meeting"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                                    <Image
                                        src="/about/3.png"
                                        alt="Community engagement session"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4 mt-8">
                                <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                                    <Image
                                        src="/about/2.png"
                                        alt="Cross-border partnership meeting"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                                    <Image
                                        src="/about/4.png"
                                        alt="Stakeholder discussion forum"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission and Value Cards Section */}
            <section className="w-full bg-primary py-16 px-4 bg-[url('/landing/feature-2.svg')] bg-cover bg-center relative">
                <div className="absolute inset-0" />
                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Mission Card */}
                        <div className="bg-primary/20 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-white">
                            <h3 className="text-2xl font-bold mb-6">
                                {t('missionValue.ourMission')}
                            </h3>
                            <p className="text-white/90 leading-relaxed mb-8">
                                {t('missionValue.missionText')}
                            </p>
                            <div className="relative h-48 rounded-lg overflow-hidden opacity-80">
                                <Image
                                    src="/about/5.png"
                                    alt="Africa map"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>

                        {/* Value Card */}
                        <div className="bg-primary/20 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-white">
                            <h3 className="text-2xl font-bold mb-6">
                                {t('missionValue.ourValue')}
                            </h3>
                            <p className="text-white/90 leading-relaxed mb-8">
                                {t('missionValue.valueText')}
                            </p>
                            <div className="relative w-36 h-48 rounded-lg overflow-hidden opacity-80">
                                <Image
                                    src="/about/5.png"
                                    alt="Africa map"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Impact Section */}
            <section className="w-full py-16 px-4 bg-gray-50">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left side - Title and Impact Label */}
                        <div className="space-y-6">
                            <div className="inline-block bg-white rounded-full px-6 py-2 border border-gray-200">
                                <span className="text-gray-600 font-medium">
                                    {t('impact.impactLabel')}
                                </span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                                {t('impact.title')}
                            </h2>
                        </div>

                        {/* Right side - Statistics Cards */}
                        <div className=" rounded-2xl py-8 text-white">
                            <div className="-space-y-6">
                                {/* Countries Reach */}
                                <div className="bg-primary rounded-tr-xl rounded-tl-4xl p-4 pb-8">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="text-4xl font-bold">
                                                {stats.countriesReach}
                                            </div>
                                            <div className="text-white/80 text-sm font-medium">
                                                {t('impact.countriesReach')}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* CSO Onboarded */}
                                <div className="bg-yellow-500 rounded-tr-xl rounded-tl-4xl p-4 pb-8">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="text-3xl font-bold text-white">
                                                {stats.organizationsCount.toLocaleString()}
                                                +
                                            </div>
                                            <div className="text-white/90 text-sm font-medium">
                                                {t('impact.csoOnboarded')}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Partnership Created */}
                                <div className="bg-red-500 rounded-tr-xl rounded-tl-4xl p-4 pb-8">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="text-3xl font-bold text-white">
                                                {stats.forumPostsCount.toLocaleString()}
                                                +
                                            </div>
                                            <div className="text-white/90 text-sm font-medium">
                                                {t('impact.partnershipCreated')}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Resources Shared */}
                                <div className="bg-green-500 rounded-xl rounded-tl-4xl p-4 pb-8">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="text-3xl font-bold text-white">
                                                {stats.resourcesCount.toLocaleString()}
                                                +
                                            </div>
                                            <div className="text-white/90 text-sm font-medium">
                                                {t('impact.resourcesShared')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
 {/* Core Values Section */}
            <section className="w-full py-16 px-4 bg-gray-50">
                <div className="container mx-auto max-w-6xl space-y-10">
                    <div className="flex flex-col gap-4 items-center">
                        <h1 className="text-4xl font-bold text-center">
                            {t('coreValues.title')}
                        </h1>
                    </div>
                    <div className="grid lg:grid-cols-4 gap-12 items-center">
                        <div className="h-[370px] bg-amber-100 flex flex-col  rounded-2xl">
                            <div className="flex flex-1  flex-col justify-center">
                                <h2 className="tex-4xl text-center font-bold text-primary">
                                    {t('coreValues.collaboration')}
                                </h2>
                            </div>
                            <div className='flex flex-1 bg-[url("/about/7.png")] bg-cover bg-center'></div>
                        </div>
                        <div className="h-[370px] bg-amber-100 flex flex-col  rounded-2xl">
                            <div className="flex flex-1  flex-col justify-center">
                                <h2 className="tex-4xl text-center font-bold text-primary">
                                    {t('coreValues.inclusivity')}
                                </h2>
                            </div>
                            <div className='flex flex-1 bg-[url("/about/8.png")] bg-cover bg-center'></div>
                        </div>
                        <div className="h-[370px] bg-amber-100 flex flex-col  rounded-2xl">
                            <div className="flex flex-1  flex-col justify-center">
                                <h2 className="tex-4xl text-center font-bold text-primary">
                                    {t('coreValues.transparency')}
                                </h2>
                            </div>
                            <div className='flex flex-1 bg-[url("/about/9.png")] bg-cover bg-center'></div>
                        </div>
                        <div className="h-[370px] bg-amber-100 flex flex-col  rounded-2xl">
                            <div className="flex flex-1  flex-col justify-center">
                                <h2 className="tex-4xl text-center font-bold text-primary">
                                    {t('coreValues.innovation')}
                                </h2>
                            </div>
                            <div className='flex flex-1 bg-[url("/about/10.png")] bg-cover bg-center'></div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
