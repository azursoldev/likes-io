import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // First try without pageLinks to avoid relation errors
    const brands = await prisma.featuredOn.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });

    // Try to fetch pageLinks separately if the table exists
    let brandsWithPageLinks = brands.map((brand: any) => ({ ...brand, pageLinks: [] }));
    
    try {
      // Only try to fetch if we have brands
      if (brands.length > 0) {
        const pageLinksData = await (prisma as any).featuredOnPageLink.findMany({
          where: {
            featuredOnId: { in: brands.map((b: any) => b.id) },
          },
        });

        // Group pageLinks by featuredOnId
        const pageLinksByBrandId = pageLinksData.reduce((acc: any, link: any) => {
          if (!acc[link.featuredOnId]) {
            acc[link.featuredOnId] = [];
          }
          acc[link.featuredOnId].push({
            id: link.id,
            pagePath: link.pagePath,
            link: link.link,
            nofollow: link.nofollow,
            featuredOnId: link.featuredOnId,
          });
          return acc;
        }, {});

        // Merge pageLinks into brands
        brandsWithPageLinks = brands.map((brand: any) => {
          const links = pageLinksByBrandId[brand.id] || [];
          return {
            ...brand,
            pageLinks: links,
          };
        });
        
        // Debug logging
        console.log('Fetched pageLinks:', {
          totalLinks: pageLinksData.length,
          brandsWithLinks: brandsWithPageLinks.filter((b: any) => b.pageLinks.length > 0).length,
          sampleLinks: pageLinksData.slice(0, 3),
        });
      }
    } catch (pageLinksError: any) {
      // Check if it's a "table doesn't exist" error or something else
      if (pageLinksError.code === 'P2021' || pageLinksError.message?.includes('does not exist')) {
        console.warn('PageLinks table does not exist yet. Run the migration SQL to create it.');
      } else {
        console.error('Error fetching pageLinks:', pageLinksError);
        console.error('Error details:', {
          code: pageLinksError.code,
          message: pageLinksError.message,
          meta: pageLinksError.meta,
        });
      }
    }

    // Convert legacy link field to pageLinks if needed
    const finalBrands = brandsWithPageLinks.map((brand: any) => {
      // If no pageLinks but has legacy link, create a default pageLink
      if ((!brand.pageLinks || brand.pageLinks.length === 0) && brand.link) {
        return {
          ...brand,
          pageLinks: [{
            id: 0,
            pagePath: 'all',
            link: brand.link,
            nofollow: false,
            featuredOnId: brand.id,
          }],
        };
      }
      return brand;
    });

    // Debug: Log final brands structure
    console.log('Returning brands with pageLinks:', finalBrands.map((b: any) => ({
      id: b.id,
      brandName: b.brandName,
      pageLinksCount: b.pageLinks?.length || 0,
      pageLinks: b.pageLinks,
    })));

    return NextResponse.json({ brands: finalBrands });
  } catch (error: any) {
    console.error('Get featured on error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch featured brands' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      brandName,
      logoUrl,
      altText,
      pageLinks = [],
      displayOrder = 0,
      isActive = true,
    } = body;

    if (!brandName) {
      return NextResponse.json(
        { error: 'Brand name is required' },
        { status: 400 }
      );
    }

    // Build data object dynamically to handle missing fields
    // Don't include link or altText initially - they may not exist in DB
    const createData: any = {
      brandName,
      logoUrl: logoUrl || null,
      displayOrder: parseInt(displayOrder),
      isActive,
    };

    // Only include altText if it's provided (will be added in fallback if needed)
    // We'll try without it first to avoid column errors

    // Only include pageLinks if the relation exists
    if (pageLinks && pageLinks.length > 0) {
      try {
        createData.pageLinks = {
          create: pageLinks.map((link: any) => ({
            pagePath: link.pagePath || 'all',
            link: link.link || null,
            nofollow: link.nofollow || false,
          })),
        };
      } catch (pageLinksError) {
        // If pageLinks relation doesn't exist, skip it
        console.warn('PageLinks relation not available, skipping:', pageLinksError);
      }
    }

    // Remove pageLinks from createData temporarily - we'll add them separately
    const pageLinksToCreate = createData.pageLinks;
    delete createData.pageLinks;

    try {
      // Create the brand first without pageLinks
      const brand = await prisma.featuredOn.create({
        data: createData,
      });

      // Try to create pageLinks separately if they exist and the table exists
      let createdPageLinks: any[] = [];
      if (pageLinksToCreate && pageLinksToCreate.create && pageLinksToCreate.create.length > 0) {
        console.log('Attempting to create pageLinks:', {
          brandId: brand.id,
          pageLinksCount: pageLinksToCreate.create.length,
          pageLinks: pageLinksToCreate.create,
        });
        
        try {
          // Try to create pageLinks using the relation
          const pageLinksData = pageLinksToCreate.create.map((link: any) => ({
            featuredOnId: brand.id,
            pagePath: link.pagePath || 'all',
            link: link.link || null,
            nofollow: link.nofollow || false,
          }));

          console.log('PageLinks data to insert:', pageLinksData);

          // Try to insert pageLinks directly if the table exists
          for (const linkData of pageLinksData) {
            try {
              console.log('Creating pageLink:', linkData);
              const createdLink = await (prisma as any).featuredOnPageLink.create({
                data: linkData,
              });
              console.log('Successfully created pageLink:', createdLink);
              createdPageLinks.push(createdLink);
            } catch (linkError: any) {
              console.error('Error creating individual pageLink:', {
                error: linkError.message,
                code: linkError.code,
                data: linkData,
              });
              // If the table doesn't exist, skip creating pageLinks
              if (linkError.code === 'P2021' || linkError.message?.includes('does not exist')) {
                console.warn('PageLinks table does not exist, skipping pageLinks creation');
                break;
              }
              throw linkError;
            }
          }
          
          console.log('Total pageLinks created:', createdPageLinks.length);
        } catch (pageLinksError: any) {
          console.error('Error in pageLinks creation block:', {
            error: pageLinksError.message,
            code: pageLinksError.code,
            stack: pageLinksError.stack,
          });
          // If pageLinks table doesn't exist, that's okay - just log it
          if (pageLinksError.code === 'P2021' || pageLinksError.message?.includes('does not exist')) {
            console.warn('PageLinks table does not exist, skipping pageLinks creation');
          } else {
            console.error('Error creating pageLinks:', pageLinksError);
          }
        }
      } else {
        console.log('No pageLinks to create:', {
          pageLinksToCreate,
          hasCreate: !!pageLinksToCreate?.create,
          createLength: pageLinksToCreate?.create?.length,
        });
      }

      return NextResponse.json({ brand: { ...brand, pageLinks: createdPageLinks } });
    } catch (createError: any) {
      // Check for Prisma error code P2022 (column does not exist) or other column errors
      if (createError.code === 'P2022' || 
          createError.message?.includes('link') || 
          createError.message?.includes('altText') || 
          createError.message?.includes('Unknown argument') ||
          createError.message?.includes('does not exist')) {
        
        // Build minimal data with only fields that definitely exist in the database
        const fallbackData: any = {
          brandName,
          logoUrl: logoUrl || null,
          displayOrder: parseInt(displayOrder),
          isActive,
        };

        // Try with minimal fields only
        try {
          const brand = await prisma.featuredOn.create({
            data: fallbackData,
          });
          return NextResponse.json({ brand: { ...brand, pageLinks: [] } });
        } catch (fallbackError: any) {
          console.error('Fallback create also failed:', fallbackError);
          return NextResponse.json(
            { error: 'Failed to create brand. Please run the database migration: ' + fallbackError.message },
            { status: 500 }
          );
        }
      }
      throw createError;
    }
  } catch (error: any) {
    console.error('Create featured on error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create featured brand. Please run: npx prisma db push' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log('PUT request received:', {
      id: body.id,
      hasPageLinks: 'pageLinks' in body,
      pageLinksType: typeof body.pageLinks,
      pageLinksIsArray: Array.isArray(body.pageLinks),
      pageLinksLength: Array.isArray(body.pageLinks) ? body.pageLinks.length : 'N/A',
      pageLinks: body.pageLinks,
      fullBody: JSON.stringify(body, null, 2),
    });
    
    const { id, pageLinks, altText, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Brand ID is required' },
        { status: 400 }
      );
    }
    
    console.log('Extracted from body:', {
      id,
      pageLinks,
      pageLinksType: typeof pageLinks,
      pageLinksIsArray: Array.isArray(pageLinks),
      updateDataKeys: Object.keys(updateData),
    });

    if (updateData.displayOrder !== undefined) {
      updateData.displayOrder = parseInt(updateData.displayOrder);
    }

    // Build update data dynamically
    const finalUpdateData: any = { ...updateData };
    
    // Only include altText if it's provided
    if (altText !== undefined) {
      finalUpdateData.altText = altText;
    }

    // Handle pageLinks separately - remove from updateData
    const pageLinksToUpdate = pageLinks;
    console.log('pageLinksToUpdate:', {
      value: pageLinksToUpdate,
      type: typeof pageLinksToUpdate,
      isArray: Array.isArray(pageLinksToUpdate),
      isUndefined: pageLinksToUpdate === undefined,
      isNull: pageLinksToUpdate === null,
      length: Array.isArray(pageLinksToUpdate) ? pageLinksToUpdate.length : 'N/A',
    });
    
    // Remove pageLinks from updateData if it exists there
    if ('pageLinks' in finalUpdateData) {
      delete finalUpdateData.pageLinks;
    }

    try {
      // Update the brand first without pageLinks
      const brand = await prisma.featuredOn.update({
        where: { id: parseInt(id) },
        data: finalUpdateData,
      });

      // Handle pageLinks separately if provided
      let updatedPageLinks: any[] = [];
      if (pageLinksToUpdate !== undefined) {
        console.log('Updating pageLinks for brand:', {
          brandId: parseInt(id),
          pageLinksCount: Array.isArray(pageLinksToUpdate) ? pageLinksToUpdate.length : 0,
          pageLinks: pageLinksToUpdate,
        });
        
        try {
          // Delete existing page links if table exists
          try {
            const deleteResult = await (prisma as any).featuredOnPageLink.deleteMany({
              where: { featuredOnId: parseInt(id) },
            });
            console.log('Deleted existing pageLinks:', deleteResult.count);
          } catch (deleteError: any) {
            // Table might not exist, that's okay
            if (deleteError.code !== 'P2021' && !deleteError.message?.includes('does not exist')) {
              throw deleteError;
            }
            console.warn('Could not delete pageLinks (table may not exist):', deleteError.message);
          }

          // Create new pageLinks if any
          if (Array.isArray(pageLinksToUpdate) && pageLinksToUpdate.length > 0) {
            const pageLinksData = pageLinksToUpdate.map((link: any) => ({
              featuredOnId: parseInt(id),
              pagePath: link.pagePath || 'all',
              link: link.link || null,
              nofollow: link.nofollow || false,
            }));

            console.log('PageLinks data to insert:', pageLinksData);

            // Try to insert pageLinks directly if the table exists
            for (const linkData of pageLinksData) {
              try {
                console.log('Creating pageLink:', linkData);
                const createdLink = await (prisma as any).featuredOnPageLink.create({
                  data: linkData,
                });
                console.log('Successfully created pageLink:', createdLink);
                updatedPageLinks.push(createdLink);
              } catch (linkError: any) {
                console.error('Error creating individual pageLink:', {
                  error: linkError.message,
                  code: linkError.code,
                  data: linkData,
                });
                // If the table doesn't exist, skip creating pageLinks
                if (linkError.code === 'P2021' || linkError.message?.includes('does not exist')) {
                  console.warn('PageLinks table does not exist, skipping pageLinks creation');
                  break;
                }
                throw linkError;
              }
            }
            
            console.log('Total pageLinks created:', updatedPageLinks.length);
          } else {
            console.log('No pageLinks to create (empty array)');
          }
        } catch (pageLinksError: any) {
          console.error('Error in pageLinks update block:', {
            error: pageLinksError.message,
            code: pageLinksError.code,
            stack: pageLinksError.stack,
          });
          // If pageLinks table doesn't exist, that's okay - just log it
          if (pageLinksError.code === 'P2021' || pageLinksError.message?.includes('does not exist')) {
            console.warn('PageLinks table does not exist, skipping pageLinks update');
          } else {
            console.error('Error updating pageLinks:', pageLinksError);
          }
        }
      } else {
        // If pageLinks not provided, try to fetch existing ones
        console.log('PageLinks not provided in update, fetching existing ones');
        try {
          const existingLinks = await (prisma as any).featuredOnPageLink.findMany({
            where: { featuredOnId: parseInt(id) },
          });
          updatedPageLinks = existingLinks || [];
          console.log('Fetched existing pageLinks:', updatedPageLinks.length);
        } catch (fetchError: any) {
          // Table might not exist, that's okay
          if (fetchError.code !== 'P2021' && !fetchError.message?.includes('does not exist')) {
            console.warn('Could not fetch pageLinks:', fetchError);
          } else {
            console.warn('PageLinks table does not exist');
          }
        }
      }

      return NextResponse.json({ brand: { ...brand, pageLinks: updatedPageLinks } });
    } catch (updateError: any) {
      // If error is about missing columns (link, altText, etc.), try without them
      if (updateError.message?.includes('link') || 
          updateError.message?.includes('altText') || 
          updateError.message?.includes('Unknown argument') ||
          updateError.message?.includes('does not exist')) {
        
        const fallbackData: any = { ...updateData };
        if (updateData.displayOrder !== undefined) {
          fallbackData.displayOrder = parseInt(updateData.displayOrder);
        }

        // Remove fields that might not exist in database
        delete fallbackData.link;
        delete fallbackData.altText;

        const brand = await prisma.featuredOn.update({
          where: { id: parseInt(id) },
          data: fallbackData,
        });

        return NextResponse.json({ brand: { ...brand, pageLinks: [] } });
      }
      throw updateError;
    }
  } catch (error: any) {
    console.error('Update featured on error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update featured brand. Please run: npx prisma db push' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Brand ID is required' },
        { status: 400 }
      );
    }

    await prisma.featuredOn.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete featured on error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete featured brand' },
      { status: 500 }
    );
  }
}
